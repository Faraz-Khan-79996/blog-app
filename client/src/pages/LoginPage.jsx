
export default function LoginPage() {

    return (
        <form className="login" onSubmit={register}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="username"
            />
            <input 
            type="password" 
            placeholder="password"
            />
            <button>Logic</button>
        </form>
    );
}
