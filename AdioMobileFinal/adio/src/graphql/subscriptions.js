/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAd = /* GraphQL */ `
  subscription OnCreateAd {
    onCreateAd {
      uniqueID
      campaignName
      adName
      email
      maxLat
      maxLng
      minLat
      minLng
      file {
        bucket
        region
        key
      }
      description
      numImpressions
    }
  }
`;
export const onUpdateAd = /* GraphQL */ `
  subscription OnUpdateAd {
    onUpdateAd {
      uniqueID
      campaignName
      adName
      email
      maxLat
      maxLng
      minLat
      minLng
      file {
        bucket
        region
        key
      }
      description
      numImpressions
    }
  }
`;
export const onDeleteAd = /* GraphQL */ `
  subscription OnDeleteAd {
    onDeleteAd {
      uniqueID
      campaignName
      adName
      email
      maxLat
      maxLng
      minLat
      minLng
      file {
        bucket
        region
        key
      }
      description
      numImpressions
    }
  }
`;
export const onCreateImpression = /* GraphQL */ `
  subscription OnCreateImpression {
    onCreateImpression {
      uniqueID
      driver
      year
      month
      date
      numImpressions
    }
  }
`;
export const onUpdateImpression = /* GraphQL */ `
  subscription OnUpdateImpression {
    onUpdateImpression {
      uniqueID
      driver
      year
      month
      date
      numImpressions
    }
  }
`;
export const onDeleteImpression = /* GraphQL */ `
  subscription OnDeleteImpression {
    onDeleteImpression {
      uniqueID
      driver
      year
      month
      date
      numImpressions
    }
  }
`;
