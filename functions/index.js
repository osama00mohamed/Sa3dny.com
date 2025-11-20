/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// بيانات بريدك
const gmailUser = "sa3dnyassuit@gmail.com"; 
const gmailPass = "APP_PASSWORD_HERE";      // باسورد التطبيقات

// إعداد Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailUser,
        pass: gmailPass
    }
});

// 📌 إرسال إيميل طلب تعليمي
exports.onEduRequest = functions.firestore
    .document("eduRequests/{requestId}")
    .onCreate(async (snap, ctx) => {
        const data = snap.data();

        const mailOptions = {
            from: gmailUser,
            to: ["sa3dnyassuit@gmail.com", "osama7mohamed11@gmail.com"],
            subject: `طلب خدمة تعليمية جديد - ${data.serviceType}`,
            text: `
📘 خدمة تعليمية جديدة:

🔹 نوع الخدمة: ${data.serviceType}
📞 رقم الهاتف: ${data.phone}
⏱ تم الإرسال في: ${new Date().toLocaleString()}

        `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email Sent (Education Request)");
        } catch (error) {
            console.error("Email Error:", error);
        }
    });

// 📌 إرسال إيميل طلب منزلي
exports.onHomeRequest = functions.firestore
    .document("requests/{requestId}")
    .onCreate(async (snap, ctx) => {
        const data = snap.data();

        const mailOptions = {
            from: gmailUser,
            to: ["sa3dnyassuit@gmail.com", "osama7mohamed11@gmail.com"],
            subject: `طلب خدمة منزلية جديد - ${data.title}`,
            text: `
🏠 خدمة منزلية جديدة:

🛠 نوع الخدمة: ${data.service}
📄 وصف المشكلة: ${data.problem}
📍 العنوان: ${data.address}
📞 رقم الهاتف: ${data.phone}
⏱ تم الإرسال في: ${new Date().toLocaleString()}

        `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email Sent (Home Request)");
        } catch (error) {
            console.error("Email Error:", error);
        }
    });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
