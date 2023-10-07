import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./styles/Modal.css";
import { ClientDropdown } from "./ModalComponent/clientDropdown";
import { AgencyDropdown } from "./ModalComponent/agencyDropdown";
import { LocationDropdown } from "./ModalComponent/locationDropdown";
import { EditAgency } from "./EditComponent/editAgency";
import { agencyID } from "./utils/agencyID";

export const EditModal = ({ closeEditModal }) => {
    const [formState, setFormState] = useState({
        selectedClient: "",
        selectedAgency: "",
        location: "",
        category: "",
        status: "",
        widgets: "",
    });

    const [errors, setErrors] = useState("");

    const handleClientSelection = (selectedClientId) => {
        setFormState(prevState => ({
            ...prevState,
            selectedClient: selectedClientId
        }));        
    };

    const handleAgencySelection = async (selectedAgencyName) => {
        setFormState({
            ...formState,
            selectedAgency: selectedAgencyName,
        });
    };  

    const handleLocationSelection = (selectedLocationName) => {
        setFormState({
            ...formState,
            location: selectedLocationName,
        });
    };

    const handleCategorySelection = (selectedOption) => {
        setFormState({
            ...formState,
            category: selectedOption.value,
        });
    };

    const handleStatusSelection = (selectedOption) => {
        setFormState({
            ...formState,
            status: selectedOption.value,
        });
    };

    const handleWidgetsSelection = (selectedOption) => {
        setFormState({
            ...formState,
            widgets: selectedOption.value,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const agencyName = formState.selectedAgency;

                if (!agencyName) {
                    // Handle the error or show a message indicating that agency name is missing
                    return;
                }

                const getAgencyID = await agencyID(agencyName);

                const response = await fetch(`${process.env.REACT_APP_API_URL}/accounts/agency/retrieve/${getAgencyID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const agencyData = await response.json();
                
    
                setFormState(prevState => ({
                    ...prevState,
                    category: agencyData.category,
                    status: agencyData.status,
                    widgets: agencyData.widgets,
                }));
            } catch (error) {
                console.error("Error fetching agency data:", error);
            }
        };
    
        fetchData(); // Call the function when the component mounts and whenever selectedAgency changes
    }, [formState.selectedAgency]); // Dependency array ensures useEffect runs when selectedAgency changes  

    return (
        <div className="modal-container">
            <div className="modal">
                <h1>Edit Account</h1>
                <form>
                    <div className="form-group">
                        <ClientDropdown
                            formState={formState}
                            onClientSelect={handleClientSelection} />
                    </div>

                    <div className="form-group">
                        <AgencyDropdown
                            formState={formState}
                            onAgencySelect={handleAgencySelection}
                        />
                    </div>

                    {!formState.selectedAgency && (
                        <div className="form-group">
                            <LocationDropdown
                                formState={formState}
                                onLocationSelect={handleLocationSelection}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <Select
                            name="category"
                            value={{ value: formState.category ?? '', label: formState.category ?? '' }}
                            onChange={handleCategorySelection}
                            options={[
                                { value: 'Reviewtrackers', label: 'Reviewtrackers' },
                                { value: 'Reviewshake', label: 'Reviewshake' },
                                { value: 'Rize Partner', label: 'Rize Partner' },
                                { value: 'Grade.us', label: 'Grade.us' },
                                { value: 'White Label', label: 'White Label' }
                            ]}
                            placeholder="Select a category"
                        />
                    </div>

                    <div className="form-group status">
                        <Select
                            name="status"
                            value={{ value: formState.status ?? '', label: formState.status ?? '' }}
                            onChange={handleStatusSelection}
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Trial', label: 'Trial' },
                            ]}
                            placeholder="Select a status"
                        />
                    </div>

                    <div className="form-group widgets">
                        <Select
                            name="widgets"
                            value={{ value: formState.widgets ?? '', label: formState.widgets ?? '' }}
                            onChange={handleWidgetsSelection}
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'None', label: 'None' },
                            ]}
                            placeholder="Select an option"
                        />
                    </div>

                    {errors && <div className="error">{`Required fields: ${errors}`}</div>}

                    <div className="buttons">
                        <EditAgency
                            formState={formState}
                            closeEditModal={closeEditModal}
                        />
                        <button
                            type="button"
                            className="close btn"
                            onClick={() => {
                                closeEditModal();
                                window.location.reload(true);
                            }}
                        >Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
