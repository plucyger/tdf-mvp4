import React, { useEffect, useState } from 'react';

    function SocialNetworking() {
      const [users, setUsers] = useState([]);
      const [newPost, setNewPost] = useState({ userId: '', content: '' });

      useEffect(() => {
        fetch('/api/social-data')
          .then(response => response.json())
          .then(data => setUsers(data.users));
      }, []);

      const handleSubmit = (userId, content) => {
        fetch('/api/submit-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, post: { content } })
        })
          .then(response => response.json())
          .then(result => {
            console.log(result.message);
            fetch('/api/social-data')
              .then(response => response.json())
              .then(data => setUsers(data.users));
          });
      };

      return (
        <div className="SocialNetworking">
          <h2>Social Networking</h2>
          <p>Welcome to the social networking hub. Here you can connect with others, share project updates, and collaborate.</p>
          <h3>Users and Posts</h3>
          {users.map(user => (
            <div key={user.id}>
              <h4>{user.name}</h4>
              <ul>
                {user.posts.map((post, index) => (
                  <li key={index}>{post.content}</li>
                ))}
              </ul>
            </div>
          ))}
          <h3>Submit New Post</h3>
          <form onSubmit={e => {
            e.preventDefault();
            handleSubmit(parseInt(newPost.userId), newPost.content);
            setNewPost({ userId: '', content: '' });
          }}>
            <select
              value={newPost.userId}
              onChange={e => setNewPost({ ...newPost, userId: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Post Content"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            />
            <button type="submit">Submit Post</button>
          </form>
        </div>
      );
    }

    export default SocialNetworking;
