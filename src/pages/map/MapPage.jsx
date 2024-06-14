
import MapComponent from '../../components/map/MapComponent';
import Modal from '../../components/modal/Modal';
import DaumPostcodeEmbed from 'react-daum-postcode';
import useModalStore from '../../stores/modalStore';
import { useState } from 'react';
import AddressForm from './../../components/common/forms/AddressForm';

export default function MapPage() {
    const { openModal, closeModal } = useModalStore();
    const [address, setAddress] = useState();
    const [roadAddress, setRoadAddress] = useState("");

    const handleComplete = (data) => {
        // let fullAddress = data.address;
        // let extraAddress = '';

        // if (data.addressType === 'R') {
        //     if (data.bname !== '') {
        //         extraAddress += data.bname;
        //     }
        //     if (data.buildingName !== '') {
        //         extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        //     }
        //     fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        // }
        setAddress(data);
        setRoadAddress(data.roadAddress);
        console.log(roadAddress)
        closeModal();
    };

    return (
        <div className='section_wrap'>
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

