// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { connectFuncsToContext, MapToLocalVideoProps } from '../../consumers';
import { MapToMediaGalleryProps, MediaGalleryContainerProps } from './consumers/MapToMediaGalleryProps';
import { convertSdkRemoteParticipantToGalleryParticipant } from '../../utils';
import { GridLayout, StreamMedia, VideoTile } from 'react-components';
import { Label, mergeStyles, Stack } from '@fluentui/react';
import ScreenShareComponent from './ScreenShare';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  gridStyle,
  stackContainerStyle,
  screenShareContainerStyle,
  videoHint,
  disabledVideoHint
} from './styles/MediaGallery.styles';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';
import { RemoteVideoTile } from './RemoteVideoTile';

export const MediaGalleryComponentBase = (props: MediaGalleryContainerProps): JSX.Element => {
  const { localParticipant, remoteParticipants, screenShareStream } = props;

  const localVideoStream = MapToLocalVideoProps({
    stream: localParticipant.videoStream,
    scalingMode: 'Crop'
  });

  const sidePanelRemoteParticipants = useMemo(() => {
    return remoteParticipants
      .filter((remoteParticipant) => {
        const screenShareParticipant =
          screenShareStream && convertSdkRemoteParticipantToGalleryParticipant(screenShareStream.user);
        return remoteParticipant.userId !== screenShareParticipant?.userId;
      })
      .map((participant, key) => {
        const label = participant.displayName;
        const stream = participant.videoStream;

        return (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={key}>
            <Stack className={aspectRatioBoxContentStyle}>
              <RemoteVideoTile stream={stream} scalingMode={'Crop'} label={label} />
            </Stack>
          </Stack>
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteParticipants, screenShareStream]);

  const gridLayoutRemoteParticipants = useMemo(() => {
    return remoteParticipants.map((participant, key) => {
      const label = participant.displayName;
      const stream = participant.videoStream;

      return (
        <Stack className={gridStyle} key={key} grow>
          <RemoteVideoTile stream={stream} scalingMode={'Crop'} label={label} displayName={label} />
        </Stack>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteParticipants]);

  const layoutLocalParticipant = useMemo(() => {
    return (
      <VideoTile
        isVideoReady={localVideoStream.isVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream.videoStreamElement} />}
        displayName={localParticipant.displayName}
      >
        <Label className={localVideoStream.isVideoReady ? videoHint : disabledVideoHint}>
          {localParticipant.displayName}
        </Label>
      </VideoTile>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, localVideoStream]);

  return screenShareStream !== undefined ? (
    <>
      <div className={stackContainerStyle}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>{layoutLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div className={screenShareContainerStyle}>
        <ScreenShareComponent screenShareScalingMode={'Fit'} screenShareStream={screenShareStream} />
      </div>
    </>
  ) : (
    <GridLayout>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {layoutLocalParticipant}
      </Stack>
      {gridLayoutRemoteParticipants}
    </GridLayout>
  );
};

export const MediaGalleryComponent = (props: MediaGalleryContainerProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MediaGalleryComponentBase, props);

export default connectFuncsToContext(MediaGalleryComponent, MapToMediaGalleryProps);
