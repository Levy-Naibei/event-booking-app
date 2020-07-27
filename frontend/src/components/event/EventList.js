import React from 'react'
import OneEvent from './OneEvent';
import './eventComponent.css';

export const EventList = (props) => {
    const events = props.events.map((event, index) => {
        return (
            <OneEvent 
                key={index}
                title={event.title}
                price={event.price}
                date={event.date}
                userId={props.authUserId}
                creatorId={event.creator._id}
                onDetail={props.onViewDetail}
            />
        );
    });

   return (<ul className="events__list">{events}</ul>);
}

export default EventList;