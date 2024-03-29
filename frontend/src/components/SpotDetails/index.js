import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import dummyImage from '../../download.png';
import OpenModalButton from '../OpenModalButton';
import CreateReviewModal from '../CreateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';
import * as spotsActions from "../../store/spots";
import * as reviewsActions from "../../store/reviews";
import './SpotDetails.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function SpotDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.currentSpot);
    const spotReviews = useSelector(state => Object.values(state.reviews.spotReviews));
    const [isSpotLoaded, setIsSpotLoaded] = useState(false);
    const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await dispatch(spotsActions.getSpot(id))
                .then(() => setIsSpotLoaded(true));
            await dispatch(reviewsActions.getSpotReviews(id))
                .then(() => setIsReviewsLoaded(true));
        }
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (isSpotLoaded && isReviewsLoaded) {
            if (sessionUser) {
                if (sessionUser.id !== spot.ownerId) {
                    let target = true;
                    spotReviews.forEach(reviewObj => {
                        if (reviewObj.userId === sessionUser.id) target = false;
                    });
                    if (target === true) setIsVisible(true);
                }
            }
        }
    }, [isSpotLoaded, isReviewsLoaded]);

    return (
        <div className='spot-details-container'>
            {isSpotLoaded &&
                <div className='spot-details'>
                    <div className='spot-details-header'>
                        <h2>{spot?.name}</h2>
                        <div>{spot?.city}, {spot?.state}, {spot?.country}</div>
                    </div>
                    <div className='spot-details-imgs'>
                        {
                            spot?.SpotImages?.map((imgObj, index) => {
                                return (
                                    <img className={imgObj.preview ? 'spot-preview-img' : `spot-alt-img alt-img-${index}`} src={imgObj.url} onError={(e) => {
                                        e.target.src = dummyImage;
                                        e.onerror = null;
                                    }} alt={imgObj.url.split('/').pop()} />
                                );
                            })
                        }
                    </div>
                    <div className='spot-details-info'>
                        <div>
                            <h2>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h2>
                            <p>{spot?.description}</p>
                        </div>
                        <div className='spot-details-reserve'>
                            <div className='spot-details-price'>${spot?.price} night</div>
                            <div className='spot-details-rating'>
                                &#9733;   {spot.avgStarRating === 0 ? "New" : `${spot.avgStarRating.toFixed(1)}`}{spot?.numReviews >= 1 && <span>   &#8231;   {spot?.numReviews} Review{spot?.numReviews > 1 ? 's' : ''}</span>}
                            </div>
                            {/* {spot?.numReviews >= 1 && <span>{spot?.numReviews} Review{spot?.numReviews > 1 ? 's' : ''}</span>} */}
                            <button className="primary reserve-btn" onClick={() => window.alert('Feature Coming Soon')}>Reserve</button>
                        </div>
                    </div>
                </div>
            }
            {isReviewsLoaded &&
                <div className='review-details'>
                    <div className='review-details-header'>
                        <h2>
                            &#9733;   {spot.avgStarRating === 0 ? "New" : `${spot.avgStarRating.toFixed(1)}`}{spot?.numReviews >= 1 && <>   &#8231;   {spot?.numReviews} Review{spot?.numReviews > 1 ? 's' : ''}</>}
                        </h2>
                        {isVisible &&
                            <OpenModalButton
                                modalComponent={<CreateReviewModal id={spot.id} setIsVisible={setIsVisible} />}
                                buttonText="Post Your Review"
                            />
                        }
                    </div>
                    <div className='review-details-list'>
                        {(spot?.numReviews < 1 && isVisible) && <div>Be the first to post a review!</div>}
                        {spotReviews?.map(reviewObj => {
                            const reviewMonth = MONTHS[new Date(reviewObj.createdAt).getMonth()];
                            const reviewYear = new Date(reviewObj.createdAt).getFullYear();
                            return (
                                <>
                                    <div className='review-info'>
                                        <p className='review-name'>{reviewObj.User?.firstName}</p>
                                        <p className='review-date'>{reviewMonth} {reviewYear}</p>
                                        <p className='review-text'>{reviewObj.review}</p>
                                        {reviewObj.userId === sessionUser?.id && <OpenModalButton
                                            modalComponent={<DeleteReviewModal id={reviewObj.id} spotId={reviewObj.spotId} setIsVisible={setIsVisible} />}
                                            buttonText="Delete"
                                        />}
                                    </div>

                                </>
                            );
                        })}
                    </div>
                </div>
            }
        </div>
    );
}

export default SpotDetails;
