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

    bfs(start: T, finish: T) {
        const paths: T[][] = [];
        const queue: {vertex: T, path: T[]}[] = [{ vertex: start, path: [start] }];
        const visited = new Set();
    
        while (queue.length) {
          const q = queue.shift();
          if (!q) break
    
          visited.add(q.vertex);
    
          if (q.vertex === finish) {
            paths.push([...q.path]);
          }
          const vertex = this.vertices.get(q.vertex)
          if (!vertex) break
          for (let edge of vertex.edges.keys()) {    
            if (!visited.has(edge)) {
              queue.push({ vertex: edge, path: [...q.path, edge] });
            }
          }
        }
        return paths.map(path=> {
            let costs = 0
            let vertex = this.vertices.get(path[0])
            for (let p = 1; p<path.length; p++) {
                costs+=vertex?.edges.get(path[p]) || 0
                vertex = this.vertices.get(path[p])
            }
            return {path, costs}
        })    
        // return paths;
    }       

    dfs(start: T, finish: T) {
        const paths = this.dfsPaths(start, finish);
        return paths.map(path=> {
            let costs = 0
            let vertex = this.vertices.get(path[0])
            for (let p = 1; p<path.length; p++) {
                costs+=vertex?.edges.get(path[p]) || 0
                vertex = this.vertices.get(path[p])
            }
            return {path, costs}
        })
    }

    private dfsPaths(start: T, finish: T, visited = new Set(), path: T[] = [], paths: T[][] = []) {
        visited.add(start);
        path.push(start);
    
        if (start === finish) {
            paths.push([...path]);
            return paths
        } 

        const vertex = this.vertices.get(start)
        if (!vertex) return paths    
        for (let edge of vertex.edges.keys()) {
            if (!visited.has(edge)) {
                paths = this.dfsPaths(edge, finish, new Set([...visited]), [...path], paths);
            }
        }
        return paths;
    }

    private nearestUnvisitedVertex () {
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
        this.visited = new Set();
        this.costs = new Map();
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
        while (vertices.length > 2) {
            let i = Math.floor(Math.random() * edges.length)
            const edge = edges[i]  
            const v1 = vertices.find(v=>v.name===edge.from)        
            const v2 = vertices.find(v=>v.name===edge.to)   
            if (!v1||!v2) break  
            v1.joins.push(...v2.joins)   
            vertices = vertices.filter(v=>v.name!==v2.name) 
            edges.forEach(edge=> {
                if (edge.from===v2.name) edge.from = v1.name
                if (edge.to===v2.name) edge.to = v1.name
            })
            edges = edges.filter(edge=>edge.from!==edge.to)
        }
        return {vertices, edges}    
    }
  
}
