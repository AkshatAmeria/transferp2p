// import { Card } from "@repo/ui/card";

// export const P2PTransactions = ({
//   transactions,
// }: {
//   transactions: {
//     time: Date;
//     amount: number;
//     toUser: string;
//   }[];
// }) => {
//   if (!transactions.length) {
//     return (
//       <Card title="Recent P2P Transfers">
//         <div className="text-center pb-8 pt-8 text-gray-500">
//           No Recent P2P Transfers
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card title="Recent P2P Transfers">
//       <div className="pt-2 space-y-3">
//         {transactions.map((t, idx) => (
//           <div key={idx} className="flex justify-between items-center">
//             <div>
//               <div className="text-sm font-medium">Sent to {t.toUser}</div>
//               <div className="text-slate-600 text-xs">
//                 {t.time.toDateString()}
//               </div>
//             </div>
//             <div className="flex flex-col justify-center text-red-600 font-medium">
//               - ₹{t.amount / 100}
//             </div>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// };


import { Card } from "@repo/ui/card";

export const P2PTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    toUserId: number;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent P2P Transfers">
        <div className="text-center pb-8 pt-8 text-gray-500">
          No Recent P2P Transfers
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent P2P Transfers">
      <div className="pt-2 space-y-3">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium">
                Sent to User #{t.toUserId}
              </div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center text-red-600 font-medium">
              - ₹{t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
