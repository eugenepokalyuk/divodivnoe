/** Маска российского телефона: любой ввод → «+7 (923) 106-86-26».
 *
 *  Пока только РФ (как договорились). Нормализуем ведущую 8 в 7 и всегда
 *  держим код страны 7 — клиенту остаётся набрать 10 цифр номера. Пустой
 *  ввод оставляем пустым, чтобы поле показывало плейсхолдер, а не «+7». */
export function formatRuPhone(input: string): string {
  const raw = input.replace(/\D/g, '');
  if (raw === '') return '';

  let digits = raw;
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits[0] !== '7') digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1); // 10 цифр после кода страны
  let out = '+7';
  if (rest.length) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ')';
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

/** Нормализованные цифры номера (11 знаков для полного РФ-номера). */
export function phoneDigits(input: string): string {
  const raw = input.replace(/\D/g, '');
  if (raw === '') return '';
  let digits = raw;
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits[0] !== '7') digits = `7${digits}`;
  return digits.slice(0, 11);
}

/** Полный ли номер (11 цифр). Тем же порогом проверяет бэкенд. */
export function isCompleteRuPhone(input: string): boolean {
  return phoneDigits(input).length === 11;
}
