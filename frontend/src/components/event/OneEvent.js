import React from 'react'
import './eventComponent.css';

const OneEvent = (props) =>
    <li key={props.eventId} className="event_list-item">
        <div>
            <h1>{props.title}</h1>
            <h3 className='event_price-date'>
                ${props.price} &#124; {props.date}
            </h3>
        </div>

        <div>
            {props.userId === props.creatorId ? 
                <p>Event Owner</p> 
                : <button
                    className="btn"
                    onClick={props.onDetail.bind(this, props.eventId)}>
                    Details
                  </button>
            }
        </div>

    </li>

export default OneEvent;