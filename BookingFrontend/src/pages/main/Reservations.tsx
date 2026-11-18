import useGetAllUserReservation from "../../queries/reservations/useGetAllUserReservations";
import Spinner from "../../components/global/Spinner";
import ReservationItem from "../../components/reservations/ReservationItem";

function Reservations() {
  const {
    data: userReservationData,
    isLoading: isLoadingUserReservation,
    error: errorUserReservations,
  } = useGetAllUserReservation();

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto pt-25 p-2">
      <div className="w-full flexColCenter gap-4">
        <h2 className="font-special font-semibold capitalize text-2xl text-orange-500">
          Reservations
        </h2>
        <div className="w-full flexColCenter gap-2">
          {isLoadingUserReservation && <Spinner />}{" "}
          {userReservationData &&
            userReservationData.data.length > 0 &&
            !isLoadingUserReservation &&
            userReservationData?.data.map((reserv) => {
              return <ReservationItem key={reserv._id} data={reserv} />;
            })}
          {userReservationData?.data.length === 0 &&
            !isLoadingUserReservation && (
              <div className="w-full flexCenter p-2 gap-4 font-semibold uppercase text-xl">
                No reservations are made or deleted by admins
              </div>
            )}
        </div>
        <div className="w-full flexColCenter gap-3 text-sm text-gray-500 font-semibold uppercase ">
          <span> R.d = Reservation Date</span>
          <span> e.d = Expiration Date</span>
        </div>
      </div>
    </div>
  );
}

export default Reservations;
