class Trie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let node = this.root;
    for (let c of word) {
      if (node[c] == null) node[c] = {};
      node = node[c];
    }
    node.isWord = true;
  }

  traverse(word) {
    let node = this.root;
    for (let c of word) {
      node = node[c];
      if (node == null) return null;
    }
    return node;
  }

  search(word) {
    const node = this.traverse(word);
    return node != null && node.isWord === true;
  }

  startsWith(prefix) {
    return this.traverse(prefix) != null;
  }
}

function test() {
  var trie = new Trie();

  trie.insert("http://robinw.co.uk2");
  trie.insert("http://robinw.co.uk1");
  trie.insert("http://robinw.co.uk4");
  trie.insert("http://robinw.co.uk5");
  trie.insert("http://robinw.co.uk6");

  return trie.search("http://robinw.co.uk1");
}

test();
