
export default function UserProfile({setMode, user, qstn, setVisitedQuestion}) {
    console.log(user)
    return (
        <div>
            <h1 className='ProfileName'>{user.name}</h1>
        </div>
    );
}
