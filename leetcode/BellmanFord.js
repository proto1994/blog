// 贝尔曼-福特算法

// d(v)=min{d(v), d(u)+l(u,v)}

function bellmanFord(graph, source) {
  let distance = [],
      length = graph.length
  for (let i = 0; i < length; i++) {
      distance[i] = Infinity
  }
  distance[source] = 0
  for (let i = 1; i < length; i++) {
    for (let [u, v, w] of graph) {
      if (distance[u] + w < distance[v]) {
        distance[v] = distance[u] + w
      }
    }
    console.log(distance)
  }

  // console.log(distance)

}

function main() {
  let graph = [
    [4, 5, 2],
    [1, 2, -3],
    [1, 5, 5],
    [2, 3, 2],
    [3, 4, 3],
  ]
  bellmanFord(graph, 1);
}
main()