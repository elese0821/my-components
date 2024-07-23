import React, { useEffect, useState } from 'react';
import MapComponent from '../../components/map/MapComponent';
import Modal from '../../components/modal/Modal';
import DaumPostcodeEmbed from 'react-daum-postcode';
import AddressForm from '../../components/common/forms/AddressForm';
import useModalStore from '../../stores/modalStore';

export default function MapPage() {
    const { openModal, closeModal } = useModalStore();
    const [address, setAddress] = useState();
    const [roadAddress, setRoadAddress] = useState("");

    const handleComplete = (data) => {
        setAddress(data);
        setRoadAddress(data.roadAddress);
        console.log(roadAddress)
        closeModal();
    };

    return (
        <div className='section_wrap flex'>
            <AddressForm openModal={openModal} addressResult={address} />
            <MapComponent roadAddress={roadAddress} />
            <Modal>
                <DaumPostcodeEmbed
                    onComplete={handleComplete}
                />
            </Modal>
        </div>
    )
}

