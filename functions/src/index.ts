/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const REGION = "southamerica-east1";

/**
 * Copia restaurantId do doc users/{uid} para a custom claim.
 */
export const syncRestaurantClaim = functions
  .region(REGION)
  .firestore.document("users/{uid}")
  .onWrite(
    async (
      change: functions.Change<functions.firestore.DocumentSnapshot>,
      context: functions.EventContext
    ) => {
      const uid = context.params.uid;
      const after = change.after.exists ? change.after.data() as any : null;
      if (!after?.restaurantId) return;

      const user = await admin.auth().getUser(uid);
      const current = user.customClaims || {};
      if (current.restaurantId === after.restaurantId) return;

      await admin.auth().setCustomUserClaims(uid, { ...current, restaurantId: after.restaurantId });
    }
  );

/**
 * Callable opcional para forçar sincronização manual.
 */
export const refreshRestaurantClaim = functions
  .region(REGION)
  .https.onCall(
    async (
      _data: any,
      context: functions.https.CallableContext
    ) => {
      if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login requerido.");
      const uid = context.auth.uid;
      const snap = await admin.firestore().doc(`users/${uid}`).get();
      if (!snap.exists) throw new functions.https.HttpsError("not-found", "Doc user inexistente.");
      const restaurantId = snap.get("restaurantId");
      if (!restaurantId) throw new functions.https.HttpsError("failed-precondition", "restaurantId ausente.");

      const user = await admin.auth().getUser(uid);
      const claims = user.customClaims || {};
      if (claims.restaurantId !== restaurantId) {
        await admin.auth().setCustomUserClaims(uid, { ...claims, restaurantId });
      }
      return { restaurantId };
    }
  );
