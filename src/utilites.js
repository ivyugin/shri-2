function formOfWord(n, word) {
  const words = {
    commit: ['коммит', 'коммита', 'коммитов'],
    vote: ['голос', 'голоса', 'голосов'],
  };
  if (n >= 10 && n < 20) return words[word][2];
  if (n % 10 === 1) return words[word][0];
  if (n % 10 < 5) return words[word][1];
  return words[word][2];
}

module.exports = { formOfWord };
