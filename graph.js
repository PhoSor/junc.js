function Node(name, childNames) {
  this.name = name;
  this.childNames = childNames;
  this.parents = 0;
}



function Graph() {
  this.nodes = {};
  this.nodeList = [];
}


Graph.prototype.add = function(name, childNames) {
  var node = new Node(name, childNames);

  this.nodes[name] = node;
  this.nodeList.push(node);
};


Graph.prototype.getRoot = function() {
  var i, node;

  for (i = 0; i < this.nodeList.length; i++) {
    node = this.nodeList[i];
    if (node.parents === 0) {
      break;
    }
  }

  return node;
};


Graph.prototype.populateRelations = function() {
  var graph = this;

  this.nodeList.forEach(function(node) {
    node.childNames.forEach(function(childName) {
      if (!graph.nodes[childName])
        throw new Error('Not provided: "' + childName + '"');
      graph.nodes[childName].parents++;
    });
  });
};


Graph.prototype.resolve = function(node, unresolved) {
  var graph = this, childDeps,
      resolved = [node.name], unresolved = unresolved || [];

  unresolved.push(node.name);
  node.childNames.forEach(function(childName) {
    if (resolved.indexOf(childName) < 0) {
      if (unresolved.indexOf(childName) > -1)
        throw new Error('Circular dependence detected: ' +
            node.name + ' -> ' + childName);
      childDeps = graph.resolve(graph.nodes[childName], unresolved);
      resolved = childDeps.concat(resolved);
    }
  });

  unresolved.pop();

  return resolved;
};


Graph.prototype.getResolved = function(rootName) {
  var resolved = [];

  this.populateRelations();
  resolved = this.resolve(this.nodes[rootName]);

  return resolved;
};


module.exports = Graph;
