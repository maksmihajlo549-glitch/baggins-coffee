// Типографика: не оставляем короткие предлоги, союзы и частицы
// в конце строки. Неразрывный пробел связывает их со следующим словом.
(() => {
  const shortWords = [
    'в', 'во', 'к', 'ко', 'с', 'со', 'у', 'о', 'об', 'обо',
    'на', 'по', 'за', 'из', 'от', 'до', 'при', 'без', 'для',
    'над', 'под', 'про', 'и', 'а', 'но', 'да', 'же', 'ли', 'бы', 'б', 'то', 'ни'
  ];

  const words = shortWords.join('|');
  // Захватываем пробел после короткого слова и заменяем его на NBSP.
  const pattern = new RegExp(`(^|[\\s\\u00A0])(${words})(?:[\\t\\n\\r ]+)`, 'giu');

  function fixOrphans(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest('script, style, noscript, svg, textarea, input, code, pre')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(pattern, (_match, before, word) => `${before}${word}\u00A0`);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => fixOrphans(), { once: true });
  } else {
    fixOrphans();
  }
})();
