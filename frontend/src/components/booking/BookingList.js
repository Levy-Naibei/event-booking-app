import React from 'react'
import './bookinglist.css';

const BookList = (props) => (
    <ul className='booking_list'>
        {props.bookings.map(booking => {
            return ((
                <li className="booking_list-item">
                    <div>
                        {booking.event.title}
                        {booking.createdAt}
                    </div>
                    <div>
                        <button 
                            className='btn'
                            onClick={props.onDelete.bind(this, booking._id)}>
                                Cancel
                        </button>        
                    </div>
                </li>
            ));
        }
        )};
    </ul>
)

export default BookList;