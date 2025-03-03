package awsservice

import (
	"context"
	"fmt"
	"io"
	"log"

	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func Config() {

	// Load Variables from Environment
	AWS_ACCESS_KEY := os.Getenv("AWS_ACCESS_KEY")
	AWS_SECRET_ACCESS_KEY := os.Getenv("AWS_SECRET_ACCESS_KEY")
	AWS_REGION := os.Getenv("AWS_REGION")
	// S3_BUCKET_NAME := os.Getenv("S3_BUCKET_NAME")
	// CLOUDFRONT_DOMAIN := os.Getenv("CLOUDFRONT_DOMAIN")

	_, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(AWS_REGION),
		config.WithCredentialsProvider(aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, ""))),
	)
	if err != nil {
		log.Fatalf("Unable to load SDK config, %v", err)
	}

	log.Println("AWS SDK configuration loaded successfully")
}

// Helper function to Upload a file to S3
func UploadFileToS3(s3Client *s3.Client, bucket, key string, file io.Reader) error {
	uploader := manager.NewUploader(s3Client)
	_, err := uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
		Body:   file,
	})
	return err
}

// Helper function to get the CloudFront URL for an object
func GetCloudFrontURL(distributionDomain, objectKey string) string {
	return fmt.Sprintf("%s/%s", distributionDomain, objectKey)
}
