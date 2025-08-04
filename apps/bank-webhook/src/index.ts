// import express from "express";
// import db from "@repo/db/client";
// const app = express();

// app.use(express.json())

// app.post("/hdfcWebhook", async (req, res) => {
//     //TODO: Add zod validation here?
//     //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
  
//     const paymentInformation: {
//         token: string;
//         userId: string;
//         amount: string
//     } = {
//         token: req.body.token,
//         userId: req.body.user_identifier,
//         amount: req.body.amount
//     };

//     try {
//         await db.$transaction([
//             db.balance.updateMany({
//                 where: {
//                     userId: Number(paymentInformation.userId)
//                 },
//                 data: {
//                     amount: {
//                         // You can also get this from your DB
//                         increment: Number(paymentInformation.amount)
//                     }
//                 }
//             }),
//             db.onRampTransaction.updateMany({
//                 where: {
//                     token: paymentInformation.token
//                 }, 
//                 data: {
//                     status: "Success",
//                 }
//             })
//         ]);

//         res.json({
//             message: "Captured"
//         })
//     } catch(e) {
//         console.error(e);
//         res.status(411).json({
//             message: "Error while processing webhook"
//         })
//     }

// })

// app.listen(3003);


import express from "express";
import db from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
    // TODO: Add zod validation & HDFC webhook secret verification

    const paymentInformation = {
        token: req.body.token as string,
        userId: Number(req.body.user_identifier),
        amount: Number(req.body.amount)
    };

    try {
        const result = await db.$transaction(async (tx) => {
            // 1️⃣ Find a Processing transaction for this token
            const transaction = await tx.onRampTransaction.findFirst({
                where: {
                    token: paymentInformation.token,
                    status: "Processing"
                }
            });

            // If not found, exit early without balance update
            if (!transaction) return null;

            // 2️⃣ Update balance
            await tx.balance.update({
                where: { userId: paymentInformation.userId },
                data: {
                    amount: {
                        increment: paymentInformation.amount
                    }
                }
            });

            // 3️⃣ Mark transaction as Success
            await tx.onRampTransaction.update({
                where: { id: transaction.id },
                data: { status: "Success" }
            });

            return true;
        });

        // If result is null → No Processing transaction found
        if (!result) {
            return res.status(400).json({
                message: "Transaction not in Processing state or already completed"
            });
        }

        res.json({ message: "Captured" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error while processing webhook" });
    }
});

app.listen(3003, () => {
    console.log("HDFC webhook server running on port 3003");
});
