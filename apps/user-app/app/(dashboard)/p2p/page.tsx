import { SendCard } from "../../../components/SendCard";

export default function(){
    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                <h1>P2P Transfer</h1>
            </div>
          <div>
            <SendCard></SendCard>
          </div>
        </div>
    )
}