import axios from 'axios';
import { useContext, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../contexts/SearchContext';
import useFetch from '../../hooks/useFetch';
import './reserve.css';

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, error, loading } = useFetch(`http://localhost:8000/api/v1/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);

  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    let dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };
  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unAvailableDates.some((date) =>
      allDates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleChange = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;

    setSelectedRooms(
      checked ? [...selectedRooms, value] : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.patch(`http://localhost:8000/api/v1/rooms/availability/${roomId}`, {
            dates: allDates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate('/');
    } catch (err) {}
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <AiFillCloseCircle className="rClose" onClick={() => setOpen(false)} />
        <span>Select Your Rooms:</span>
        {data.map((room) => (
          <div className="rItem" key={room._id}>
            <div className="rItemInfo">
              <div className="rTitle">{room.title}</div>
              <div className="rDesc">{room.desc}</div>
              <div className="rMax">Max people: {room.maxPeople}</div>
            </div>

            {room.roomNumbers.map((roomNumber) => (
              <div className="room" key={roomNumber.number}>
                <label>{roomNumber.number}</label>
                <input
                  type="checkbox"
                  value={roomNumber._id}
                  onChange={handleChange}
                  disabled={!isAvailable(roomNumber)}
                />
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve or Book Now!
        </button>
      </div>
    </div>
  );
};
export default Reserve;
