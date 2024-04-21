function ghostLength(ghostData) {
  var snapshots = ghostData.snapshots
  var totalLength = 0
  
  for (let i = 0; i < snapshots.length; i++) {
    let snapshot = snapshots[i]
    let position = snapshot.p
    
    let x = parseFloat(position[0])
    let y = parseFloat(position[1])
    let z = parseFloat(position[2])
    
    let distance = Math.sqrt(x*x + y*y + z*z)
    totalLength += distance
  }
  return totalLength
}

async function getGhost(ghostID) {
  result = await fetch("https://cdn.dashcraft.io/v2/prod/ghost/" + ghostID + ".json")
  return await result.json()
}

async function getTrackGhosts(trackID) {
  var trackData = await fetch("https://api.dashcraft.io/trackv2/" + trackID, {
   headers: {
     'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM0NmMzNGExYmEyMjQyNGYyZTAwMzIiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcwNzM3MTU3Mn0.0JVw6gJhs4R7bQGjr8cKGLE7CLAGvyuMiee7yvpsrWg'
   }})
  trackData = await trackData.json()
  var lb = await trackData.leaderboard
  var finalGhostData = {}
  
  for (let i = 0; i < lb.length; i++) {
    let entry = lb[i]
    let ghostData = await getGhost(entry._id)
    let ghostLen = ghostLength(ghostData)
    let averageSpeed = ghostLen / entry.time
    finalGhostData[entry.user._id] = {averageSpeed:averageSpeed, ghostLen:ghostLen}
  }
  return finalGhostData
}