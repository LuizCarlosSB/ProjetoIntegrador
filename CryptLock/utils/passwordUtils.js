// utils/passwordUtils.js

/**
 * Verifica a força de uma senha e retorna uma pontuação, um rótulo e uma cor.
 * @param {string} password - A senha a ser verificada.
 * @returns {{score: number, label: string, color: string}}
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  if (!password) return { score: 0, label: '', color: '#ccc' };

  // Critérios de pontuação
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  switch (score) {
    case 5:
      return { score, label: 'Muito Forte', color: '#32CD32' };
    case 4:
      return { score, label: 'Forte', color: '#9ACD32' };
    case 3:
      return { score, label: 'Média', color: '#FFD700' };
    case 2:
      return { score, label: 'Fraca', color: '#FFA500' };
    default:
      return { score, label: 'Muito Fraca', color: '#FF4500' };
  }
};

/**
 * Valida se uma senha atende aos critérios mínimos de segurança para o cadastro.
 * @param {string} password - A senha a ser validada.
 * @returns {{isValid: boolean, message: string}}
 */
export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('• Pelo menos 8 caracteres');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('• Pelo menos uma letra minúscula');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('• Pelo menos uma letra maiúscula');
  }
  if (!/\d/.test(password)) {
    errors.push('• Pelo menos um número');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('• Pelo menos um caractere especial (!@#$%^&*)');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      message: 'A senha não é segura. Requisitos:\n' + errors.join('\n'),
    };
  }

  return { isValid: true, message: '' };
};