// import { getServerSession } from "next-auth";
// import prisma from "@repo/db/client";
// import { authOptions } from "../../lib/auth";
// import { P2PTransactions } from "../../../components/P2PTransactions";
// import { OnRampTransactions } from "../../../components/OnRampTransactions";

// async function getP2PTransactions() {
//   const session = await getServerSession(authOptions);

//   const p2p = await prisma.p2pTransfer.findMany({
//     where: {
//       fromUserId: Number(session?.user?.id),
//     },
//     select: {
//       amount: true,
//       timestamp: true,
//       toUserId: true,
//     },
//     orderBy: {
//       timestamp: "desc",
//     },
//   });

//   return p2p.map((t) => ({
//     time: t.timestamp,
//     amount: t.amount,
//     toUserId: t.toUserId,
//   }));
// }

// async function getOnRampTransactions() {
//     const session = await getServerSession(authOptions);
//     const txns = await prisma.onRampTransaction.findMany({
//         where: {
//             userId: Number(session?.user?.id)
//         }
//     });
//     return txns.map(t => ({
//         time: t.startTime,
//         amount: t.amount,
//         status: t.status,
//         provider: t.provider
//     }))
// }
// export default async function() {
//     const p2pTransactions = await getP2PTransactions();
//     const onRampTransactions = await getOnRampTransactions();
//     return <div>
//         <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
//  Transactions
//         </div>
//         <div>
//             <P2PTransactions transactions={p2pTransactions} />
//             <OnRampTransactions transactions={onRampTransactions} />
//         </div>
       
//     </div>
// }



import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { OnRampTransactions } from "../../../components/OnRampTransactions";

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);

  const p2p = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
    select: {
      amount: true,
      timestamp: true,
      toUserId: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return p2p.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    toUserId: t.toUserId,
  }));
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);

  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function TransactionsPage() {
  const p2pTransactions = await getP2PTransactions();
  const onRampTransactions = await getOnRampTransactions();

  return (
    <div className="w-screen min-h-screen  p-4 md:p-8">
      
      <div className="text-3xl md:text-4xl text-[#6a51a6] font-bold mb-6 text-center md:text-left">
        Transactions
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        
        <div className=" rounded-xl shadow-md p-4 md:p-6">
          <P2PTransactions transactions={p2pTransactions} />
        </div>

        
        <div className=" rounded-xl shadow-md p-4 md:p-6">
          <OnRampTransactions transactions={onRampTransactions} />
        </div>
      </div>
    </div>
  );
}
