import { useRef, useState } from 'react';
import styles from './Login.module.css';
import Button from '../buttonComponent/Button';
import RegisterModal from '../registerComponents/RegisterModal';

function LoginModal({ onClose }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [mostrarRegister, setMostrarRegister] = useState(false)

    const handleRegister = () => {
        setMostrarRegister(true);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;


        try {
            const response = await fetch('https://localhost:7207/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al iniciar sesión.");
            }

            const data = await response.json();
            const { accessToken } = data;
            console.log('Inicio de sesión exitoso:', accessToken);
            localStorage.setItem('accessToken', accessToken);
            onClose(); // Cierra el modal al iniciar sesión exitosamente

        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error en el login:', error);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.loginModule}>
            <button className={styles.logoCerrar} onClick={onClose}>
                    <img src="./public/icon/cerrar-icon.svg" alt="icono cerrar" />
                </button>

                <div className={styles.imagenUser}>
                    <img src="./public/icon/user-grande-icon.svg" alt="Logo usuario" />
                </div>

                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    {errorMessage && <div className={styles.error}>{errorMessage}</div>}

                    <div className={styles.inputGroup}>
                        <input
                            id="email"
                            name="email"
                            ref={emailRef}
                            placeholder="Correo electrónico"
                            type="email"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            id="password"
                            name="password"
                            ref={passwordRef}
                            placeholder="Contraseña"
                            type="password"
                            required
                        />
                    </div>

                    <div className={styles.rememberMe}>
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">Recuérdame</label>
                    </div>


                    <div className={styles.buttonContainer}> 
                        <Button type="submit" variant='large' color='morado'>
                            Iniciar Sesión
                        </Button>

                        <Button variant='large' color='azul' onClick={handleRegister}>
                            Nuevo Usuario
                        </Button>
                    </div>
                </form>
                {mostrarRegister && <RegisterModal onClose={() => setMostrarRegister(false)} />}
            </div>
        </div>
    );
}

export default LoginModal;