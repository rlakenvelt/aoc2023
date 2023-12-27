export class Vertex {
    name: string
    edges: Map<string, number>
    constructor(name: string) {
        this.name = name
        this.edges = new Map()
    }
}

export class Graph {
    private vertices: Map<string, Vertex>
    private directed: boolean = false
    private weighted: boolean = false
    private visited: Set<string> = new Set();
    private costs: Map<string, number> = new Map()

    constructor(directed?: boolean, weighted?: boolean) {
        this.vertices = new Map();
        if (directed!==undefined) this.directed = directed
        if (weighted!==undefined) this.weighted = weighted
    }

    addEdge(from: string, to: string, weight: number = 1) {
        if (!this.vertices.has(from)) this.vertices.set(from, new Vertex(from))
        if (!this.vertices.has(to)) this.vertices.set(to, new Vertex(to))
        this.vertices.get(from)?.edges.set(to, weight)
        if (!this.directed) {
            this.vertices.get(to)?.edges.set(from, weight)
        }
    }

    display() {
        console.log('GRAPH')
        for (let vertex of this.vertices.values()) {
            let vertices;
            if (this.weighted)
                vertices = Array.from(vertex.edges.entries()).map(e=>e.join(':')).join(' ')
            else
                vertices = Array.from(vertex.edges.keys()).join(' ')
            console.log('  VERTEX', vertex.name, 
                        '=>', vertices)
        }

    }
    reset() {
        this.visited = new Set();
        this.costs = new Map();
    }

    bfs(start: string)
    {
        this.reset()
        const queue: string[] = [];
        const result: string[] = [];

        this.visited.add(start);
        result.push(start);
        queue.push(start)

        while (queue.length) {
            const vertexname: string = queue.shift() || '';
            const vertex = this.vertices.get(vertexname)
            if (!vertex) break
            for (let [edge, weight] of vertex.edges.entries()) {
                if (!this.visited.has(edge)) {
                    this.visited.add(edge);
                    result.push(edge);
                    queue.push(edge);
                }
            }
        }
        return result
    }
    dfs(start: string)
    {
        this.reset()
        const stack: string[] = [];
        const result: string[] = [];

        stack.push(start)
      
        while (stack.length) {
            const vertexname: string = stack.pop() || '';
            const vertex = this.vertices.get(vertexname)
      
            if (!this.visited.has(vertexname)&&vertex) {
                this.visited.add(vertexname);
                result.push(vertexname);
                for (let [edge, weight] of vertex.edges.entries()) {
                    stack.push(edge);
                }
          }
        }    
        return result;
    }

    nearestUnvisitedVertex () {
          let shortest  = Infinity;
          let foundVertex = '';

          for (let [vertex, weight] of this.costs.entries()) {
              if (weight < shortest && !this.visited.has(vertex)) {
                  shortest = weight;
                  foundVertex = vertex
              }
          }
          return this.vertices.get(foundVertex);
      };

    dijkstra(start: string, finish: string) {
        this.reset()
        const queue: string[] = []; 
        const parents: Map<string, string> = new Map();

        const startVertex = this.vertices.get(start)
        if (!startVertex) return

        this.costs.set(start, 0)
        parents.set(finish, '')

        for (const [edge, weight] of startVertex.edges.entries()) {
            this.costs.set(edge, weight)
            parents.set(edge, start)
        }

        let currentVertex = this.nearestUnvisitedVertex();

        while (currentVertex) {
            let distance = this.costs.get(currentVertex.name) || 0;

            for (let [child, weight] of currentVertex.edges.entries()) {
            
                if (this.visited.has(child)) continue

                let newdistance = distance + weight;
                const c = this.costs.get(child) || Infinity
                if (c > newdistance) {
                    this.costs.set(child, newdistance);
                    parents.set(child, currentVertex.name);
                }
            }
            this.visited.add(currentVertex.name);
            currentVertex = this.nearestUnvisitedVertex();
        }

        let shortestPath = [finish];
        let parent = parents.get(finish);
        while (parent) {
           shortestPath.push(parent);
           parent = parents.get(parent);
        }
        shortestPath.reverse();
        return {costs: this.costs.get(finish), path: shortestPath}
    }



    // minimumEdgeCut(numEdgesToRemove: number) {
    //     let vertices = this.vertices.size;
    //     let removed: Set<string> = new Set();
    
    //     while (vertices > 1) {
    //         let maxDegree = -1;
    //         let currentVertex: Vertex | null = null;
    
    //         for (let vertex of this.vertices.values()) {
    //             if (!removed.has(vertex.name) && vertex.edges.size > maxDegree) {
    //                 maxDegree = vertex.edges.size;
    //                 currentVertex = vertex;
    //             }
    //         }
    //         // console.log(vertices, currentVertex)
    //         if (currentVertex === null) {
    //             break; // No more vertices to process
    //         }
    
    //         removed.add(currentVertex.name);
    //         vertices--;
    
    //         for (let neighbor of currentVertex.edges.values()) {
    //             if (!removed.has(neighbor)) {
    //                 // Update the degrees of neighbors when a vertex is removed
    //                 this.vertices.get(neighbor)?.edges.delete(currentVertex.name);
    //                 vertices--;
    //             }
    //         }
    //     }
    
    //     // Identify and remove the specified number of edges
    //     let edgesToRemove = 0;
    //     for (let vertex of this.vertices.values()) {
    //         if (removed.has(vertex.name)) {
    //             edgesToRemove++;
    //             if (edgesToRemove === numEdgesToRemove) {
    //                 break;
    //             }
    //         }
    //     }
    
    //     // The remaining vertices form one part of the cut, and the removed vertices form the other part
    //     let cutPart1: string[] = [];
    //     let cutPart2: string[] = [];
    
    //     for (let vertex of this.vertices.values()) {
    //         if (removed.has(vertex.name)) {
    //             cutPart2.push(vertex.name);
    //         } else {
    //             cutPart1.push(vertex.name);
    //         }
    //     }
    
    //     return { cutPart1, cutPart2 };
    // }
    
}
