
export default function LoginPage() {

    return (
        <form className="login">
            <h1>Login</h1>
            <input
                type="text"
                placeholder="username"
                minlength="4"
            />
            <input 
            type="password" 
            placeholder="password"
            />
            <button>Logic</button>
        </form>
    );
}

