import React, { useEffect, useState } from 'react';

export default function AddressForm({ openModal, addressResult }) {
    const [formData, setFormData] = useState({
        postalCode: '',
        roadAddress: '',
        detailAddress: ''
    });

    const { roadAddress, zonecode } = addressResult || {};

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleAddressSearch = () => {
        openModal()
    };

    useEffect(() => {
        if (addressResult) {
            setFormData({
                postalCode: zonecode,
                roadAddress: roadAddress,
                detailAddress: ''
            })
        }
    }, [addressResult])


    return (
        <div className="container mx-auto p-4">
            <section className="max-w-md mx-auto bg-white p-4 shadow rounded">
                <h1 className="text-lg font-bold mb-4">주소찾기</h1>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                            우편번호
                        </label>
                        <div className="flex mt-1">
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleAddressChange}
                                className="w-3/4 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled
                            />
                            <button
                                type="button"
                                onClick={handleAddressSearch}
                                className="w-1/4 px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
                            >
                                주소찾기
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="roadAddress" className="block text-sm font-medium text-gray-700">
                            도로명 주소
                        </label>
                        <input
                            type="text"
                            id="roadAddress"
                            name="roadAddress"
                            value={formData.roadAddress}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">
                            상세 주소 (빈칸 입력 가능)
                        </label>
                        <input
                            type="text"
                            id="detailAddress"
                            name="detailAddress"
                            value={formData.detailAddress}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </form>
            </section>

        </div>
    );
}
