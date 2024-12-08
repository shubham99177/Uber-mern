import { Captain } from "../models/captain.model.js";

export const captaincreate = async (
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capicity,
  vehicleType
) => {
  console.log(firstname, lastname, email, password, color, plate, capicity, vehicleType);

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capicity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captain = await Captain.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password, // No need to hash here, since it's handled in the schema
    vehicle: {
      color,
      plate,
      capicity,
      vehicleType,
    },
  });

  return captain;
};
