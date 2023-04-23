import { ExclamationTriangleIcon, UserPlusIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import ComboBox, { People } from './ComboBox';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import RsvpSuccessful from './RsvpSuccessful';
import RsvpError from './RsvpError';

type RsvpProps = {
    
};

interface Guest{
    id: string;
    name: string;
}

interface RSVP {
    name: string;
    seatNumber: number;
    numberOfGuests: number;
    guests?: Guest[];
    answer: "Yes" | "No";
}

const people = [
    { id: 1, name: 'Anand Dans', seatNumber: 1, numberOfGuests: 3, code: "123" },
    { id: 2, name: 'Paul Bryan Pabillaran', seatNumber: 10, numberOfGuests: 2, code: "RSf423"},
    { id: 3, name: 'Arjo Antatico', seatNumber: 10, numberOfGuests: 5, code: "RSf5213" },
  // More users...
];

const Rsvp:React.FC<RsvpProps> = () => {
    
    const [selectedPerson, setSelectedPerson] = useState<People>();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [addGuest, setAddGuest] = useState("");
    const [isComingAnswer, setIsComingAnswer] = useState(false);
    const [code, setCode] = useState("");
    const [codeMatch, setIsCodeMatch] = useState(false);
    const [buttonToggle, setButtonToggle] = useState(false);
    const [isCheckDisabled, setIsCheckDisabled] = useState(true);
    const [isSubmitDisbaled, setIsSubmitDisbaled] = useState(true);
    const [error, setError] = useState("");
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [rsvpError, setRsvpError] = useState(false);

    const isComing = (answer: string) => {
        if(answer === "Yes"){
            setIsComingAnswer(true);
            setButtonToggle(false);
        } else if(answer === "No") {
            setIsComingAnswer(false);
            setIsCodeMatch(false);
            setIsCheckDisabled(true);
            setButtonToggle(true);
            setError("");
            setAddGuest("");
            setGuests([]);
        }
    }

    const checkCode = () => {
        if(code === selectedPerson?.code){
            setIsCodeMatch(true);
            setButtonToggle(true)
            setError("");
        } else {
            setCode("")
            setError("Code does not match.");
            setButtonToggle(false)
        }
    }

    const submit = async () =>{
        try{
            const selectedId= selectedPerson!.id.toString();
            const answer = isComingAnswer ? "Yes" : "No";
            const addGuests = guests.map((item) => item.name);
    
            const rsvp: RSVP = {
                name: selectedPerson!.name,
                seatNumber: selectedPerson!.seatNumber,
                numberOfGuests: selectedPerson!.numberOfGuests,
                guests: addGuests as [],
                answer: answer
            }
    
            await setDoc(doc(firestore, "rsvp", selectedId), rsvp);
            setRsvpSuccess(true)
        } catch (error){
            setRsvpError(true);
            console.log("Error: ", error)
        }
        
    }

    useEffect(()=>{
        if(selectedPerson){
            setIsCodeMatch(false);
            setCode("")
            setButtonToggle(false);
            setIsCheckDisabled(true);
            setError("")
            setAddGuest("");
            setGuests([]);
        }
    }, [selectedPerson]);

    useEffect(()=>{
        if(code.length > 1){
            setIsCheckDisabled(false);
        } else {
            setIsCheckDisabled(true);
            setButtonToggle(false)
        }
    },[code])
    
    return (
        <div className="container mx-auto sm:px-6 lg:px-8 flex justify-center h-[auto] py-[50px]">
            <div className="w-full flex justify-center items-center">
                <div className='w-11/12 md:w-3/12 h-[fit-content]' >
                    {rsvpSuccess ? (
                        <RsvpSuccessful/>
                    ):(
                        <>
                            <p className="text-center text-1xl leading-8 text-gray-500 mb-5">
                                Let us know if you will be able to make it.
                            </p>
                            <ComboBox setSelectedPerson={setSelectedPerson} selectedPerson={selectedPerson} people={people} />
                            {selectedPerson && 
                                <select
                                    id="location"
                                    name="location"
                                    className="mt-4 mb-4 block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue="Are you coming?"
                                    onChange={(event)=>{isComing(event.target.value)}}
                                    disabled={codeMatch}
                                >
                                    <option value="Are you coming?" selected>Are you coming?</option>
                                    <option value="Yes" >Yes</option>
                                    <option value="No" >No</option>
                                </select>
                            }

                            {isComingAnswer && 
                                <>
                                    <div className={`rounded-md mt-2 mb-2 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 ${false && ' ring-red-300 ring-2 '}`}>
                                        <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                        Enter Code
                                        </label>
                                        <input
                                            onChange={(event) => {setCode(event.target.value)}}
                                            value={code}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className={`block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:opacity-75`}
                                            placeholder="Code"
                                            disabled={codeMatch}
                                        />
                                    </div>
                                    
                                </>
                            }
                            {/* {codeMatch &&  */}
                            {codeMatch &&
                                <div>
                                    <h3 className="text-base font-semibold leading-6 text-gray-900 mt-5">Your table # and the number of guests you can bring.</h3>
                                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="truncate text-sm font-medium text-gray-500 text-center">{`Table #`}</dt>
                                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 text-center">{selectedPerson?.seatNumber}</dd>
                                        </div>
                                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                        <dt className="truncate text-sm font-medium text-gray-500 text-center">{`Guests`}</dt>
                                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 text-center">{selectedPerson?.numberOfGuests}</dd>
                                        </div>
                                    </dl>
                                    {/* GUESTS */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mt-6">
                                            Add Guests
                                        </label>
                                        <div className="mt-2 flex rounded-md shadow-sm">
                                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <UserPlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={addGuest}
                                                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Full Name"
                                                onChange={(event) => {setAddGuest(event.target.value)}}
                                            />
                                            </div>
                                            <button
                                                onClick={()=> {
                                                    if(selectedPerson?.numberOfGuests){
                                                        let guestLen = guests?.length;
                                                        if(guestLen < selectedPerson?.numberOfGuests){
                                                            setGuests((prev) => [...prev, {
                                                                id: guestLen,
                                                                name: addGuest
                                                            }] as Guest[]);
                                                            setAddGuest("");
                                                        } else {
                                                            setError("Maximun number of guests.")
                                                        }
                                                    }
                                                }}
                                                type="button"
                                                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        { guests && 
                                            <div className="mt-3" >
                                                <ul role="list" className="divide-y divide-gray-100">
                                                    {guests.map((person) => (
                                                    <li key={person.id} className="flex items-center justify-between gap-x-6 py-5">
                                                        <div className="flex gap-x-4">
                                                            <div className="min-w-0 flex-auto">
                                                                <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={()=>{
                                                                setGuests((prev) => [...prev.filter(item => item.id !== person.id)]);
                                                            }}
                                                            className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" aria-hidden="true"/>
                                                        </button>
                                                    </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="rounded-md bg-yellow-50 p-4 mt-6 mb-2">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>
                                                    Ayaw pataka og dala og guests na more than sa number na naka assign nimo kay limited ra and tanan. Otherwise, maglingkod sila sa salug og kamo magpa kaon. Daghang Salamat!
                                                </p>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {error && 
                                <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                                </div>
                            </div>
                            }
                            {buttonToggle ? (
                                <Button onClick={()=>{submit()}} color="primary" className="disabled:opacity-75" disabled={false}>PLEASE RSVP</Button>
                            ):(
                                <Button onClick={()=>{checkCode()}} color="primary" className="disabled:opacity-75" disabled={isCheckDisabled}>SUBMIT</Button>
                            )}
                            {rsvpError && <RsvpError/>}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Rsvp;