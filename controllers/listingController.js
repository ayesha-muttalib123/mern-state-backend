const Listing = require("../models/Listing.model");
const { off } = require("../models/user.model");

exports.createListing = async (req, res) => {
  try {
    console.log("Form Data received by backend:", req.body);
    const {
      name,
      description,
      regularPrice,
      address,
      furnished,
      parking,
      type,
      bathroom,
      bedrooms,
      offer,
      discountedPrice,
      imageUrls,
      userRefs,
    } = req.body.formData;
    console.log("Form Data received by backend:", req.body);
    const newListing = new Listing({
      name,
      description,
      regularPrice,
      address,
      furnished,
      parking,
      type,
      bathroom,
      bedrooms,
      offer,
      discountedPrice,
      imageUrls,
      userRefs,
    });

    await newListing.save();
    res.json({ success: true, _id: newListing._id });
    console.log("new l;istings" + newListing);
  } catch (error) {
    console.error("Error saving listing:", error);
    res.json({ success: false, message: error.message });
  }
};

// const ListingModel = require('../models/Listing.model');

// exports.createListing = async (req, res) => {
//     try {
//         const listing = await ListingModel.create(req.body);
//         console.log("Listing created:", listing);
//         res.status(201).json({
//             success: true,
//             data: listing
//         });
//     } catch (error) {
//         console.error("Error creating listing:", error); // Log the error for debugging
//         res.status(400).json({
//             success: false,
//             message: "Failed to create listing",
//             error: error.message // Send the error message in the response
//         });
//     }
// };

exports.deleteListing = async (req, res) => {
  const listings = await Listing.findById(req.params.id);

  if (!listings) {
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });
  }

  if (req.user.id !== listings.userRefs.toString()) {
    return res
      .status(401)
      .json({ success: false, message: "you can delete your own listings" });
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
  }
};

exports.updateListing = async (req, res) => {
  const listings = await Listing.findById(req.params.id);

  if (!listings) {
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });
  }
  if (req.user.id !== listings.userRefs.toString()) {
    return res
      .status(401)
      .json({ success: false, message: "you can update your own listings" });
  }
  try {
    await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
      //new true is for it will return new data updated ata
    );
    res.json({
      success: true,
      message: "Listing updated successfully",
      listings,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res
      .status(400)
      .json({
        success: false,
        message: "Failed to update listing",
        error: error.message,
      });
  }
};

exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.findById(req.params.id);
    res.json({
      success: true,
      message: "Listings fetched successfully",
      listings,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res
      .status(400)
      .json({
        success: false,
        message: "Failed to fetch listings",
        error: error.message,
      });
  }
};
exports.getAllListings = async (req, res) => {
  try {

    
    // Define the limit for pagination, default to 9 if not specified in query
    const limit = parseInt(req.query.limit) || 9;
    // Calculate the starting index for pagination, default to 0 if not specified
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Determine if the listings should be filtered by offer status
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      // If offer is not provided or is 'false', set it to match any value (both true and false)
      offer = { $in: [false, true] };
    }

    // Determine if the listings should be filtered by parking availability
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      // If parking is not provided or is 'false', set it to match any value (both true and false)
      parking = { $in: [false, true] };
    }

    // Determine if the listings should be filtered by furnishing status
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      // If furnished is not provided or is 'false', set it to match any value (both true and false)
      furnished = { $in: [false, true] };
    }

    // Determine the type of listings to filter by (e.g., rent or sale)
    let type = req.query.type;
    if (type === undefined || type === "all") {
      // If type is not provided or is 'all', set it to match both rent and sale
      type = { $in: ["rent", "sale"] };
    }

    // Retrieve the search term for filtering listings by name like nasim it will fetch everything
    const searchTerm = req.query.searchTerm || "";
    // Retrieve the sorting field (default to createdAt)
    const sort = req.query.sort || "createdAt";
    // Retrieve the sorting order (default to descending)
    const order = req.query.order || "desc";

    // Query the listings with the specified filters, sorting, and pagination
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // Case-insensitive search for name
      offer,
      parking,
      furnished,
      type,
    })
    .sort({ [sort]: order }) // Sort by the specified field and order
    .limit(limit) // Limit the number of results
    .skip(startIndex); // Skip the results based on the starting index

    // Respond with the filtered, sorted, and paginated listings
    return res.status(200).json(listings);
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json(error);
  }
};
