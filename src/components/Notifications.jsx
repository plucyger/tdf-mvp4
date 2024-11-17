import React, { useEffect, useState } from 'react';

    function Notifications() {
      const [notifications, setNotifications] = useState([]);
      const userId = localStorage.getItem('userId');

      useEffect(() => {
        fetch(`/api/notifications?userId=${userId}`)
          .then(response => response.json())
          .then(data => setNotifications(data.notifications));
      }, [userId]);

      return (
        <div className="Notifications">
          <h2>Notifications</h2>
          <ul>
            {notifications.map(notification => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      );
    }

    export default Notifications;
