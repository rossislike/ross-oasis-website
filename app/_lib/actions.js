"use server"

import { revalidatePath } from "next/cache"
import { auth, signIn, signOut } from "./auth"
import { supabase } from "./supabase"
import { getBooking, getBookings } from "./data-service"
import { redirect } from "next/navigation"

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"))

  const session = await auth()
  if (!session) throw new Error("You must be logged in")

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsIds = guestBookings.map((booking) => booking.id)

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking")

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  }

  // await new Promise((res) => setTimeout(res, 2000))

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error("Booking could not be updated")
  }

  revalidatePath("/account/reservations")
  revalidatePath(`/account/reservations/edit/${bookingId}`)

  redirect("/account/reservations")
}

export async function deleteReservation(bookingId) {
  const session = await auth()
  if (!session) throw new Error("You must be logged in")

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsIds = guestBookings.map((booking) => booking.id)

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking")
  const { error } = await supabase.from("bookings").delete().eq("id", bookingId)

  if (error) {
    console.error(error)
    throw new Error("Booking could not be deleted")
  }

  revalidatePath("/account/reservations")
}

export async function updateGuest(formData) {
  const session = await auth()
  if (!session) throw new Error("You must be logged in")

  const nationalID = formData.get("nationalID")
  const [nationality, countryFlag] = formData.get("nationality").split("%")

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID")

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  }
  // console.log(updateData)
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)

  if (error) throw new Error("Guest could not be updated")

  revalidatePath("/account/profile")
  // return data
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}
