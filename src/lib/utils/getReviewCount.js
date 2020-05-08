
export const getReviewCount = (reviews) => {
  let count0 = 0;
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;
  let count5 = 0;
  const total = reviews.length;
  reviews.forEach(review => {
    switch (review.rating) {
      case 0: 
        count0++;
        break;
      case 1:
        count1++;
        break;
      case 2:
        count2++;
        break;
      case 3:
        count3++;
        break;
      case 4:
        count4++;
        break;
      case 5:
        count5++;
        break;
      default: 
        break;
    }
  })
  return {
    rating0: (count0 / total) * 100,
    rating1: (count1 / total) * 100,
    rating2: (count2 / total) * 100,
    rating3: (count3 / total) * 100,
    rating4: (count4 / total) * 100,
    rating5: (count5 / total) * 100,
  }
}
