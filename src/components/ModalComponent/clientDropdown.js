import React, { useState, useEffect } from "react";
import CreatableSelect from 'react-select/creatable';
import { AddClient } from "./addClient";

export const ClientDropdown = ({ onClientSelect }) => {
    const [allClients, setAllClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/accounts/client/retrieve/all`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const options = data.map((opts) => ({
                    label: opts.client,
                    value: opts.client,
                }));

                // Sort the clients alphabetically
                const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label));
                setAllClients(sortedOptions);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []); // Empty dependency array to run the effect only once

    const addedClient = (clientName) => {
        // Call the AddClient function with the necessary parameters
        AddClient(clientName, setAllClients, setSelectedClient);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedClient(selectedOption);

        // Pass the selected client to the parent component
        if (selectedOption) {
            onClientSelect(selectedOption.value);
        }
    };

    return (
        <div>
            <CreatableSelect
                value={selectedClient}
                onChange={handleSelectChange}
                options={allClients}
                isClearable
                isSearchable
                onCreateOption={addedClient}
                placeholder="Enter Client Name"
            />
        </div>
    );
};