// Add two vectors
function addVectors(v, u) {
    return [ v[0] + u[0], v[1] + u[1] ];
}

// Substract two vectors
function subtractVectors(v, u) {
    return [ v[0] - u[0], v[1] - u[1] ];
}

// Calculate the Euclidean distance between two vectors
// d = sqrt((x-x0)^2+(y-y0)`2)
function calculateDistance(v, u) {
    return Math.sqrt(Math.pow((v[0] - u[0]),2) + Math.pow((v[1] - u[1]),2));
}