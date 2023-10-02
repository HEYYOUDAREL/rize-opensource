import React, { useState, useEffect } from "react";
import Select from "react-select";
import { clientID } from "../utils/clientID";

export const AgencyDropdown = ({ formState, onAgencySelect }) => {
	const [allAgencies, setAllAgencies] = useState([]);
	const [selectedAgency, setSelectedAgency] = useState(null);
	
	useEffect(() => {
		const fetchAgencies = async () => {
			
			if (!formState.selectedClient) {
				return;
			}
			
			try {
				const clientName = formState.selectedClient;
				const getClientID = await clientID(clientName);
				
				if (!getClientID) {
					return;
				}
				
				const response = await fetch(`${process.env.REACT_APP_API_URL}/accounts/client/retrieve/${getClientID}`);
				if (!response.ok) {
					throw new Error(`Network response was not ok (status ${response.status})`);
				}
				
				const data = await response.json();
				
				// Extract agencies from the "agencies" array
				const clientAgencies = data.agencies.map((agencyData) => ({
					label: agencyData.agency,
					value: agencyData.agency,
				}));
				
				setAllAgencies(clientAgencies);
			} catch (error) {
				console.error("Error fetching data:", error);
				// Handle the error, e.g., show an error message to the user
			}
		};
		
		fetchAgencies();
	}, [formState.selectedClient]);
	
	const handleSelectChange = (selectedOption) => {
		setSelectedAgency(selectedOption);
		
		if (selectedOption) {
			onAgencySelect(selectedOption.value);
		}
	};
	
	return (
		<div>
			<Select
			value={selectedAgency}
			onChange={handleSelectChange}
			options={allAgencies}
			isClearable
			isSearchable
			placeholder="Select Agency"
			/>
		</div>
	);
};