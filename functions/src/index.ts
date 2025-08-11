/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const REGION = "southamerica-east1";

/**
 * Copia restaurantId do doc users/{uid} para a custom claim.
 */
export const syncRestaurantClaim = functions
  .region(REGION)
  .firestore.document("users/{uid}")
  .onWrite(async (change, context) => {
    const uid = context.params.uid;
    const after = change.after.exists ? change.after.data() : null;
    if (!after) return;
    const restaurantId = after.restaurantId;
    if (!restaurantId) return;

    const user = await admin.auth().getUser(uid);
    const current = user.customClaims || {};
    if (current.restaurantId === restaurantId) return;

    await admin.auth().setCustomUserClaims(uid, { ...current, restaurantId });
  });

/**
 * Callable opcional para forçar sincronização manual.
 */
export const refreshRestaurantClaim = functions
  .region(REGION)
  .https.onCall(async (_data, context) => {
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
  });
