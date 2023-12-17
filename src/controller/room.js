let rooms = [];
let roomid = 100;

const CreateRoom = (req, res) => {
  try {
    const { seats, amenities, pricePerHour } = req.body;
    if (seats && amenities && pricePerHour) {
      const newroom = {
        id: roomid + 1,
        seats,
        amenities,
        pricePerHour,
        bookings: [],
      };
      roomid++;
      rooms.push(newroom);

      res.status(201).send({
        message: "Room Created",
        room: rooms,
      });
    } else {
      res.status(400).send({
        message: "enter the correct format",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const BookRoom = (req, res) => {
  try {
    if (rooms.length !== 0) {
      const { customerName, startTime, endTime, date } = req.body;
      const roomId = parseInt(req.params.id);

      // Find the room by ID
      const room = rooms.find((r) => r.id === roomId);

      if (!room) {
        res.status(404).send({
          message: "Room not found",
        });
      }

      // Check if the room is available for the given time slot
      const isAvailable = room.bookings.every(
        (booking) =>
          booking.date !== date ||
          booking.endTime <= startTime ||
          booking.startTime >= endTime
      );

      if (!isAvailable) {
        res.status(400).send({
          message: "Room is not available for the specified time slot",
        });
      }

      // Book the room
      const newBooking = {
        id: room.bookings.length + 1,
        customerName,
        startTime,
        endTime,
        date,
      };

      room.bookings.push(newBooking);
      res.send({
        message: "Room Booked successfully",
        room: rooms,
      });
    } else {
      res.send({
        message: "Create Room first",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const AllRooms = (req, res) => {
  try {
    if (rooms.length !== 0) {
      const roomsData = rooms.map((room) => {
        const { id, seats, amenities, pricePerHour, bookings } = room;
        const isBooked = bookings.length > 0;

        if (isBooked) {
          const bookingDetails = bookings.map((booking) => {
            const { customerName, date, startTime, endTime } = booking;
            return {
              customerName,
              date,
              startTime,
              endTime,
            };
          });

          return {
            id,
            seats,
            amenities,
            pricePerHour,
            status: "Booked",
            bookingDetails,
          };
        } else {
          return {
            id,
            seats,
            amenities,
            pricePerHour,
            status: "Available",
          };
        }
      });

      res.status(200).send({
        rooms: roomsData,
      });
    } else {
      res.send({
        message: "Create Room first",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const Customer = (req, res) => {
  try {
    const customerName = req.params.customerName;

    // Filter bookings for the specified customer
    const customerBookings = rooms.flatMap((room) =>
      room.bookings
        .filter((booking) => booking.customerName === customerName)
        .map((booking) => ({
          customerName: booking.customerName,
          roomId: room.id,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          bookingId: booking.id,
        }))
    );
    if (customerBookings.length !== 0) {
      res.status(200).send({
        data: customerBookings,
      });
    } else {
      res.send({
        message: "customer with the given name does not book any room",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const RoomsWithCustomerDetails = (req, res) => {
  try {
    const customersWithBookings = rooms.flatMap((room) =>
      room.bookings.map((booking) => ({
        customerName: booking.customerName,
        roomId: room.id,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      }))
    );
    if (customersWithBookings.length !== 0) {
      res.status(200).send({
        data: customersWithBookings,
      });
    } else {
      res.send({
        message: "No customer had done Booking",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export default {
  CreateRoom,
  BookRoom,
  AllRooms,
  Customer,
  RoomsWithCustomerDetails,
};
