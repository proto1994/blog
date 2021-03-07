// 迪杰斯特拉 算法

/**
 *  src = [0 , 1, 34]
 *
 *
 */

function Dijkstra(graph, src) {
  let dist = [];
  let visited = [];
  const length = graph.length;
  for (let i = 0; i < length; i++) {
    visited[i] = false;
    dist[i] = Infinity;
  }
  dist[src] = 0;
  let i = 0;
  while (i < length - 1) {
    visited[i] = true;
    const currentEdges = graph[i];
    const currentLength = currentEdges.length;
    for (let j = 0; j < currentLength; j++) {
      if (currentEdges[j]) {
        if (dist[src] + currentEdges[j] < dist[j]) {
          dist[j] = dist[src] + currentEdges[j];
        }
      }
    }

    let min = Infinity;
    let minIndex = -2;
    console.log(dist, 'dist')
    for (let i = 0; i < dist.length; i++) {
      if (!visited[i] && dist[i] < min) {
        min = dist[i];
        minIndex = i;
      }
    }
    src = minIndex;
    i++;
  }
  console.log(dist)
  return dist
}

function main() {
  let graph = [
    [0, 2, 4, 0, 0, 0],
    [0, 0, 2, 4, 2, 0],
    [0, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 0, 2],
    [0, 0, 0, 3, 0, 2],
    [0, 0, 0, 0, 0, 0],
  ];

  Dijkstra(graph, 0);
}

main()