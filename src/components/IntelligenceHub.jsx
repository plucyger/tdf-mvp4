import React, { useEffect, useState } from 'react';

    function IntelligenceHub() {
      const [data, setData] = useState({ jobs: [], grants: [], donors: [] });
      const [newJob, setNewJob] = useState({ title: '', description: '' });
      const [newGrant, setNewGrant] = useState({ title: '', description: '' });
      const [newDonor, setNewDonor] = useState({ name: '', description: '' });
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        fetch('/api/intelligence-data')
          .then(response => response.json())
          .then(data => setData(data));
      }, []);

      const handleSubmit = (type, data) => {
        fetch('/api/submit-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type, data })
        })
          .then(response => response.json())
          .then(result => {
            console.log(result.message);
            fetch('/api/intelligence-data')
              .then(response => response.json())
              .then(data => setData(data));
          });
      };

      const filteredData = {
        jobs: data.jobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase())),
        grants: data.grants.filter(grant => grant.title.toLowerCase().includes(searchTerm.toLowerCase())),
        donors: data.donors.filter(donor => donor.name.toLowerCase().includes(searchTerm.toLowerCase()))
      };

      return (
        <div className="IntelligenceHub">
          <h2>Intelligence Hub</h2>
          <p>Welcome to the intelligence hub. Here you can find information about jobs, grants, donors, partnerships, and more.</p>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <h3>Jobs</h3>
          <ul>
            {filteredData.jobs.map((job, index) => (
              <li key={index}>
                <strong>{job.title}</strong>: {job.description}
              </li>
            ))}
          </ul>
          <h3>Grants</h3>
          <ul>
            {filteredData.grants.map((grant, index) => (
              <li key={index}>
                <strong>{grant.title}</strong>: {grant.description}
              </li>
            ))}
          </ul>
          <h3>Donors</h3>
          <ul>
            {filteredData.donors.map((donor, index) => (
              <li key={index}>
                <strong>{donor.name}</strong>: {donor.description}
              </li>
            ))}
          </ul>
          <h3>Submit New Data</h3>
          <form onSubmit={e => {
            e.preventDefault();
            handleSubmit('job', newJob);
            setNewJob({ title: '', description: '' });
          }}>
            <h4>New Job</h4>
            <input
              type="text"
              placeholder="Title"
              value={newJob.title}
              onChange={e => setNewJob({ ...newJob, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newJob.description}
              onChange={e => setNewJob({ ...newJob, description: e.target.value })}
            />
            <button type="submit">Submit Job</button>
          </form>
          <form onSubmit={e => {
            e.preventDefault();
            handleSubmit('grant', newGrant);
            setNewGrant({ title: '', description: '' });
          }}>
            <h4>New Grant</h4>
            <input
              type="text"
              placeholder="Title"
              value={newGrant.title}
              onChange={e => setNewGrant({ ...newGrant, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newGrant.description}
              onChange={e => setNewGrant({ ...newGrant, description: e.target.value })}
            />
            <button type="submit">Submit Grant</button>
          </form>
          <form onSubmit={e => {
            e.preventDefault();
            handleSubmit('donor', newDonor);
            setNewDonor({ name: '', description: '' });
          }}>
            <h4>New Donor</h4>
            <input
              type="text"
              placeholder="Name"
              value={newDonor.name}
              onChange={e => setNewDonor({ ...newDonor, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newDonor.description}
              onChange={e => setNewDonor({ ...newDonor, description: e.target.value })}
            />
            <button type="submit">Submit Donor</button>
          </form>
        </div>
      );
    }

    export default IntelligenceHub;
