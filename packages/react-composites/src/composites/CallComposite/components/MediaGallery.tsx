// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo, useState, useEffect } from 'react';
import { VideoGallery, VideoStreamOptions, OnRenderAvatarCallback } from '@internal/react-components';
import { useSelector } from '../hooks/useSelector';
import { usePropsFor } from '../hooks/usePropsFor';
import { getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';

const VideoGalleryStyles = {
  root: {
    height: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

const remoteVideoViewOption = {
  scalingMode: 'Crop'
} as VideoStreamOptions;

/**
 * @private
 */
export interface MediaGalleryProps {
  isVideoStreamOn?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);

  // When transitioning to the call page we need to trigger onStartLocalVideo() to
  // transition the local preview camera setting into the call. @TODO: Can we simply
  // have the callHandlers handle this transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  useEffect(() => {
    if (isPreviewCameraOn && !props.isVideoStreamOn && !isButtonStatusSynced) {
      props.onStartLocalVideo();
    }
    setIsButtonStatusSynced(true);
  }, [isButtonStatusSynced, isPreviewCameraOn, props]);

  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOption={localVideoViewOption}
        remoteVideoViewOption={remoteVideoViewOption}
        styles={VideoGalleryStyles}
        layout="floatingLocalVideo"
        onRenderAvatar={(userId, options) => (
          <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
            <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
          </Stack>
        )}
      />
    );
  }, [props.onFetchAvatarPersonaData, videoGalleryProps]);

  return VideoGalleryMemoized;
};
