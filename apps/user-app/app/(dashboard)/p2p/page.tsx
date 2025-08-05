// import { SendCard } from "../../../components/SendCard";
// import prisma from "@repo/db/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
// import { BalanceCard } from "../../../components/BalanceCard";
// import { timeStamp } from "console";
// import { P2PTransactions } from "../../../components/P2PTransactions";

// async function getBalance(){
//   const session  = await getServerSession(authOptions);
//   const balance = await prisma.balance.findFirst({
//     where: {
//       userId: Number(session?.user?.id)
//     }
//   });
//   return {
//     amount: balance?.amount || 0,
//     locked: balance?.locked || 0
//   }
// }

// export async function getP2PTransactions() {
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

// export default async function(){
//   const balance = await getBalance();
//     return (
//         <div className="w-screen ">
//             <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
//                 <h1>P2P Transfer</h1>
//             </div>
//             <div  className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
//                 <div>
//             <SendCard></SendCard>
//           </div>
//           <div>
//             <BalanceCard amount={balance.amount} locked={balance.locked} />
//           </div>
//           <div>
//             <P2PTransactions transactions={await getP2PTransactions()} />
//           </div>
//             </div>
        
//         </div>
//     )
// }


import prisma from "@repo/db/client";
import { SendCard } from "../../../components/SendCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";


async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

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

export default async function P2PTransferPage() {
  const balance = await getBalance();
  const transactions = await getP2PTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-4 p-4 items-start">
        {/* Left Column */}
        <div className="flex-1 self-start">
          <SendCard />
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-4 self-start">
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <P2PTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
