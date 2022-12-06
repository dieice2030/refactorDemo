import FloorClass from "./components/floor/floorClass"
import WallClass from "./components/wall/wallClass"
import DoorClass from "./components/door/doorClass"

class HouseClass {
  wallClass = new WallClass()
  floorClass = new FloorClass()
  doorClass = new DoorClass()
}

export default new HouseClass()