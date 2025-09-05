function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const toggleButton = document.querySelector('.toggle-password');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.textContent = '🔒';
            } else {
                passwordInput.type = 'password';
                toggleButton.textContent = '👁️';
            }
        }
        
        // Função para validar o formulário
        function validateForm() {
            let isValid = true;
            
            // Validar nome
            const firstName = document.getElementById('firstName');
            const firstNameError = document.getElementById('firstNameError');
            if (!firstName.value.trim()) {
                firstNameError.style.display = 'block';
                isValid = false;
            } else {
                firstNameError.style.display = 'none';
            }
            
            // Validar sobrenome
            const lastName = document.getElementById('lastName');
            const lastNameError = document.getElementById('lastNameError');
            if (!lastName.value.trim()) {
                lastNameError.style.display = 'block';
                isValid = false;
            } else {
                lastNameError.style.display = 'none';
            }
            
            // Validar email
            const email = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailError.style.display = 'none';
            }
            
            // Validar curso
            const course = document.getElementById('course');
            const courseError = document.getElementById('courseError');
            if (!course.value) {
                courseError.style.display = 'block';
                isValid = false;
            } else {
                courseError.style.display = 'none';
            }
            
            // Validar senha
            const password = document.getElementById('password');
            const passwordError = document.getElementById('passwordError');
            if (password.value.length < 8) {
                passwordError.style.display = 'block';
                isValid = false;
            } else {
                passwordError.style.display = 'none';
            }
            
            // Validar confirmação de senha
            const confirmPassword = document.getElementById('confirmPassword');
            const confirmPasswordError = document.getElementById('confirmPasswordError');
            if (password.value !== confirmPassword.value) {
                confirmPasswordError.style.display = 'block';
                isValid = false;
            } else {
                confirmPasswordError.style.display = 'none';
            }
            
            return isValid;
        }
        
        // Função para enviar dados para o servidor
        async function registerUser(userData) {
            try {
                // Mostrar indicador de carregamento
                document.getElementById('loadingIndicator').style.display = 'block';
                document.getElementById('submitButton').disabled = true;
                
                // Enviar dados para o endpoint do servidor
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                
                const result = await response.json();
                
                // Esconder indicador de carregamento
                document.getElementById('loadingIndicator').style.display = 'none';
                document.getElementById('submitButton').disabled = false;
                
                if (response.ok) {
                    // Mostrar mensagem de sucesso
                    const successMessage = document.getElementById('successMessage');
                    successMessage.style.display = 'block';
                    
                    // Limpar formulário
                    document.getElementById('registerForm').reset();
                    
                    // Redirecionar após 2 segundos
                    // !!! NOTE : Ajuste este código, não está funcionando como esperado
                    setTimeout(() => {
                        window.location.href = '../views/main.html';
                    }, 2000);
                    
                    return true;
                } else {
                    alert('Erro no cadastro: ' + (result.message || 'Tente novamente.'));
                    return false;
                }
            } catch (error) {
                console.error('Erro ao registrar usuário:', error);
                
                // Esconder indicador de carregamento
                document.getElementById('loadingIndicator').style.display = 'none';
                document.getElementById('submitButton').disabled = false;
                
                alert('Erro de conexão. Verifique se o servidor está rodando.');
                return false;
            }
        }
        
        // Event listener para o envio do formulário
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault(); // Isso impede o envio tradicional do formulário
            
            if (validateForm()) {
                // Coletar dados do formulário
                const user = {
                    firstName: document.getElementById('firstName').value.trim(),
                    lastName: document.getElementById('lastName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    course: document.getElementById('course').value,
                    plainTextPassword: document.getElementById('password').value
                };
                
                // Enviar dados para o servidor
                await registerUser(user);
            }
        });
        
        // Adicionar validação em tempo real
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateForm();
            });
        });