export class Vertex<T> {
    name: T
    edges: Map<T, number>
    constructor(name: T) {
        this.name = name
        this.edges = new Map()
    }
}

export class Graph<T> {
    private vertices: Map<T, Vertex<T>>
    private directed: boolean = false
    private weighted: boolean = false
    private visited: Set<T> = new Set();
    private costs: Map<T, number> = new Map()

    constructor(directed?: boolean, weighted?: boolean) {
        this.vertices = new Map();
        if (directed!==undefined) this.directed = directed
        if (weighted!==undefined) this.weighted = weighted
    }

    addEdge(from: T, to: T, weight: number = 1) {
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

    bfs(start: T)
    {
        this.reset()
        const queue: T[] = [];
        const result: T[] = [];

        this.visited.add(start);
        result.push(start);
        queue.push(start)

        while (queue.length) {
            const vertexname: T | undefined = queue.shift();
            if (vertexname===undefined) break
            const vertex = this.vertices.get(vertexname)
            if (!vertex) break
            for (let edge of vertex.edges.keys()) {
                if (!this.visited.has(edge)) {
                    this.visited.add(edge);
                    result.push(edge);
                    queue.push(edge);
                }
            }
        }
        return result
    }
    dfs(start: T)
    {
        this.reset()
        const stack: T[] = [];
        const result: T[] = [];

        stack.push(start)
      
        while (stack.length) {
            const vertexname: T | undefined = stack.pop() ;
            if (vertexname===undefined) break
            const vertex = this.vertices.get(vertexname)
      
            if (!this.visited.has(vertexname)&&vertex) {
                this.visited.add(vertexname);
                result.push(vertexname);
                for (let edge of vertex.edges.keys()) {
                    stack.push(edge);
                }
          }
        }    
        return result;
    }

    nearestUnvisitedVertex () {
          let shortest  = Infinity;
          let foundVertex: T | undefined = undefined;

          for (let [vertex, weight] of this.costs.entries()) {
              if (weight < shortest && !this.visited.has(vertex)) {
                  shortest = weight;
                  foundVertex = vertex
              }
          }
          if (foundVertex===undefined) return undefined
          return this.vertices.get(foundVertex);
      };

    dijkstra(start: T, finish: T) {
        this.reset()
        const queue: T[] = []; 
        const parents: Map<T, T> = new Map();

        const startVertex = this.vertices.get(start)
        if (!startVertex) return

        this.costs.set(start, 0)
        parents.set(finish, finish)

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

    kargerMinCut() {
        let vertices: {name: T, joins: T[]}[] = []
        let edges: {from: T, to: T}[] = []
        this.vertices.forEach(vertex=> {
            vertices.push({name:vertex.name, joins:[vertex.name]})
            for (let edge of vertex.edges.keys()) {
                if (!edges.find(e=>e.from===edge&&e.to===vertex.name)) {
                    edges.push({from: vertex.name, to: edge})
                }
            }
        })
        // console.log('START')
        // console.log(vertices)
        // console.log(edges)
        while (vertices.length > 2) {
            let i = Math.floor(Math.random() * edges.length)
            const edge = edges[i]  
            // console.log(`Removing edge from ${edge.from} to ${edge.to}`)   
            const v1 = vertices.find(v=>v.name===edge.from)        
            const v2 = vertices.find(v=>v.name===edge.to)   
            // console.log('V1', v1)
            // console.log('V2', v2)
            if (!v1||!v2) break  
            v1.joins.push(...v2.joins)   
            vertices = vertices.filter(v=>v.name!==v2.name) 
            edges.forEach(edge=> {
                if (edge.from===v2.name) edge.from = v1.name
                if (edge.to===v2.name) edge.to = v1.name
            })
            edges = edges.filter(edge=>edge.from!==edge.to)
            // console.log('VERTICES AFTER', vertices)
            // console.log('EDGES AFTER', edges)

        }
        return {vertices, edges}
     
    }

  
     


 


    
}
