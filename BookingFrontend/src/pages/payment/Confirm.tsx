import { useEffect, useRef } from "react";
import useConfirmReservations from "../../queries/reservations/useConfirmReservations";
import { useSearchParams } from "react-router-dom";

function Confirm() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const didRun = useRef(false);
  const {
    mutate: confirmReservation,
    isPending: isConfirming,
    error: errorConfirm,
    isSuccess,
  } = useConfirmReservations();

  useEffect(() => {
    if (sessionId && didRun.current === false) {
      didRun.current = true;
      confirmReservation({ id: sessionId });
    }
  }, [sessionId, confirmReservation]);

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto pt-25 p-2">
      <div className="w-full flexColCenter gap-4 text-2xl font-semibold uppercase font-special">
        {isConfirming && <p>Confirming your reservation.....</p>}
        {isSuccess && <p>Reservation confirmed successfully!</p>}
        {errorConfirm && <p>Failed to confirm your reservation.</p>}
        {!sessionId && <p>Session ID is missing.</p>}
      </div>
    </div>
  );
}

export default Confirm;
