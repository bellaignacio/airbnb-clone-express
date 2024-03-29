import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewsActions from "../../store/reviews";

function DeleteReviewModal({ id, spotId, setIsVisible }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(reviewsActions.deleteReview(id, spotId))
            .then(closeModal)
            .then(() => setIsVisible(true));
    };

    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <form onSubmit={handleSubmit}>
                <button type="submit">Yes (Delete Review)</button>
                <button className='accent' onClick={closeModal}>No (Keep Review)</button>
            </form>
        </>
    );
}

export default DeleteReviewModal;
